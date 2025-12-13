import React from 'react';

interface JsonTreeNodeDropIndicatorsProps {
  isDropTarget: boolean;
  dropPosition?: 'before' | 'after' | 'inside';
}

export const JsonTreeNodeDropIndicators: React.FC<JsonTreeNodeDropIndicatorsProps> = ({
  isDropTarget,
  dropPosition,
}) => {
  if (!isDropTarget) return null;

  return (
    <>
      {/* Drop indicator for before position */}
      {dropPosition === 'before' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500"></div>
      )}
      
      {/* Drop indicator for after position */}
      {dropPosition === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
      )}
      
      {/* Drop indicator for inside position */}
      {dropPosition === 'inside' && (
        <div className="absolute inset-0 border-2 border-green-500 rounded pointer-events-none"></div>
      )}
    </>
  );
};

export default JsonTreeNodeDropIndicators;