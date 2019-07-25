import React, { useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { useLayoutDnd } from '../../contexts/LayoutDnd';
import FieldItem from '../FieldItem';

import ItemTypes from '../../utils/ItemTypes';

const Item = ({
  itemIndex,
  moveItem,
  moveRow,
  name,
  removeField,
  rowIndex,
  size,
  type,
}) => {
  const {
    goTo,
    metadatas,
    selectedItemName,
    setEditFieldToSelect,
  } = useLayoutDnd();
  const ref = useRef(null);
  const [{ clientOffset, isOver }, drop] = useDrop({
    accept: ItemTypes.EDIT_FIELD,
    hover(item, monitor) {
      // We use the hover only to reorder full size items
      if (!ref.current) {
        return;
      }

      if (item.size !== 12) {
        return;
      }

      const dragIndex = monitor.getItem().itemIndex;
      const hoverIndex = itemIndex;
      const dragRow = monitor.getItem().rowIndex;
      const targetRow = rowIndex;

      // Don't replace item with themselves
      if (dragIndex === hoverIndex && dragRow === targetRow) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragRow < targetRow && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragRow > targetRow && hoverClientY > hoverMiddleY) {
        return;
      }

      // console.log({ item });
      moveRow(dragRow, targetRow);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.rowIndex = targetRow;
      item.itemIndex = hoverIndex;

      return;
    },
    drop(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = monitor.getItem().itemIndex;
      const hoverIndex = itemIndex;
      const dragRow = monitor.getItem().rowIndex;
      const targetRow = rowIndex;

      // Don't reorder on drop for full size elements since it is already done in the hover
      if (item.size === 12) {
        return;
      }

      // Don't replace item with themselves
      if (dragIndex === hoverIndex && dragRow === targetRow) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Scroll window if mouse near vertical edge(100px)

      // Horizontal Check --
      if (
        Math.abs(monitor.getClientOffset().x - hoverBoundingRect.left) >
        hoverBoundingRect.width / 1.8
      ) {
        // TODO ADD NEW LINE
        moveItem(dragIndex, hoverIndex + 1, dragRow, targetRow);

        item.itemIndex = hoverIndex + 1;
        item.rowIndex = targetRow;
        return;
      }

      // Vertical Check |

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex, dragRow, targetRow);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.

      item.itemIndex = hoverIndex;
      item.rowIndex = targetRow;

      return;
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      clientOffset: monitor.getClientOffset(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      itemType: monitor.getItemType(),
    }),
  });
  const [{ isDragging, getItem }, drag, preview] = useDrag({
    canDrag() {
      return name !== '_TEMP_';
    },
    begin() {
      setEditFieldToSelect(name, type);
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      getItem: monitor.getItem(),
    }),
    item: { type: ItemTypes.EDIT_FIELD, itemIndex, rowIndex, name, size },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Create the ref
  drag(drop(ref));

  let showLeftCarret = false;
  let showRightCarret = false;

  if (ref.current && clientOffset) {
    const hoverBoundingRect = ref.current.getBoundingClientRect();

    showLeftCarret =
      isOver &&
      getItem.size !== 12 &&
      Math.abs(clientOffset.x - hoverBoundingRect.left) <
        hoverBoundingRect.width / 2;
    showRightCarret =
      isOver &&
      getItem.size !== 12 &&
      // lastIndexOnLine === itemIndex &&
      Math.abs(clientOffset.x - hoverBoundingRect.left) >
        hoverBoundingRect.width / 2;

    if (name === '_TEMP_') {
      showLeftCarret = isOver && getItem.size !== 12;
      showRightCarret = false;
    }
  }

  return (
    <FieldItem
      isDragging={isDragging}
      isSelected={name === selectedItemName}
      label={get(metadatas, [name, 'edit', 'label'], '')}
      name={name}
      onClickEdit={() => setEditFieldToSelect(name, type)}
      onClickRemove={() => removeField(rowIndex, itemIndex)}
      push={goTo}
      showLeftCarret={showLeftCarret}
      showRightCarret={showRightCarret}
      size={size}
      type={type}
      ref={ref}
    />
  );
};

Item.defaultProps = {
  type: 'string',
};

Item.propTypes = {
  itemIndex: PropTypes.number.isRequired,
  moveItem: PropTypes.func.isRequired,
  moveRow: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  removeField: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  type: PropTypes.string,
};

export default Item;
