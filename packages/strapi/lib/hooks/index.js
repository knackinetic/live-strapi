'use strict';

const { uniq, difference, get, isUndefined, merge } = require('lodash');

module.exports = async function() {
  /** Utils */

  const hookConfig = this.config.hook;

  // check if a hook exists
  const hookExists = key => {
    return !isUndefined(this.hook[key]);
  };

  // check if a hook is enabled
  const hookEnabled = key =>
    get(hookConfig, ['settings', key, 'enabled'], false) === true;

  // list of enabled hooks
  const enableddHook = Object.keys(this.hook).filter(hookEnabled);

  const addDependencies = (acc, hookKey) => {
    const deps = this.hook[hookKey].dependencies || [];
    if (deps.length === 0) return acc.concat(hookKey);
    else return acc.concat(deps).concat(hookKey);
  };

  // Method to initialize hooks and emit an event.
  const initialize = hookKey => {
    if (this.hook[hookKey].loaded == true) return;

    const module = this.hook[hookKey].load;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(`(hook: ${hookKey}) is taking too long to load.`),
        hookConfig.timeout || 1000
      );

      this.hook[hookKey] = merge(this.hook[hookKey], module);

      Promise.resolve()
        .then(() => module.initialize())
        .then(() => {
          clearTimeout(timeout);
          this.hook[hookKey].loaded = true;
          resolve();
        })
        .catch(err => {
          clearTimeout(timeout);

          if (err) {
            return reject(err);
          }
        });
    });
  };

  /**
   * Run init functions
   */

  // Run beforeInitialize of every hook
  await Promise.all(
    enableddHook.map(key => {
      const { beforeInitialize } = this.hook[key].load;
      if (typeof beforeInitialize === 'function') {
        return beforeInitialize();
      }
    })
  );

  // run the initialization of an array of hooks sequentially
  const initdHookSeq = async hookArr => {
    for (let key of uniq(hookArr)) {
      await initialize(key);
    }
  };

  const hooksBefore = get(hookConfig, 'load.before', [])
    .filter(hookExists)
    .filter(hookEnabled)
    .reduce(addDependencies, []);

  const hooksAfter = get(hookConfig, 'load.after', [])
    .filter(hookExists)
    .filter(hookEnabled)
    .reduce(addDependencies, []);

  const hooksOrder = get(hookConfig, 'load.order', [])
    .filter(hookExists)
    .filter(hookEnabled)
    .reduce(addDependencies, []);

  const unspecifieddHook = difference(
    enableddHook,
    hooksBefore,
    hooksOrder,
    hooksAfter
  ).reduce(addDependencies, []);

  // before
  await initdHookSeq(hooksBefore);

  // ordered // rest of hooks
  await initdHookSeq(hooksOrder);
  await initdHookSeq(unspecifieddHook);

  // after
  await initdHookSeq(hooksAfter);
};
