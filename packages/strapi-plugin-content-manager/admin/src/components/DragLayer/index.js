import React from 'react';
import { useDragLayer } from 'react-dnd';
import ItemTypes from '../../utils/itemsTypes';
import RelationItem from '../SelectMany/Relation';
import { Li } from '../SelectMany/components';
import FieldItem from '../FieldItem';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(initialOffset, currentOffset, mouseOffset) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  const { x, y } = mouseOffset;
  // TODO adjust
  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform,
    WebkitTransform: transform,
  };
}

const CustomDragLayer = () => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
    mouseOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    mouseOffset: monitor.getClientOffset(),
  }));

  function renderItem() {
    switch (itemType) {
      case ItemTypes.RELATION:
        return (
          <Li>
            <RelationItem data={item.data} mainField={item.mainField} />
          </Li>
        );
      case ItemTypes.EDIT_FIELD:
        return <FieldItem name={item.name} size={12} isEditing />;
      default:
        return null;
    }
  }
  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(initialOffset, currentOffset, mouseOffset)}
        className="col-md-2"
      >
        {renderItem()}
      </div>
    </div>
  );
};

export default CustomDragLayer;
