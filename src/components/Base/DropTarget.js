import React, { useEffect, useRef } from 'react';

export default function DropTarget({ children, handleFileDrop, setDragging }) {
  const dropRef = useRef(null);
  const fileInput = useRef(null);
  let counter = 0;
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragIn = e => {
    e.preventDefault();
    e.stopPropagation();
    counter++;
    setDragging(true);
  };
  const handleDragOut = e => {
    e.preventDefault();
    e.stopPropagation();
    counter--;
    if (counter === 0) {
      setDragging(false);
    }
  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    counter = 0;
    handleFileDrop(e.dataTransfer.files);
  };

  useEffect(() => {
    let target = dropRef?.current;
    target.addEventListener('dragenter', handleDragIn);
    target.addEventListener('dragleave', handleDragOut);
    target.addEventListener('dragover', handleDrag);
    target.addEventListener('drop', handleDrop);
    return () => {
      target.removeEventListener('dragenter', handleDragIn);
      target.removeEventListener('dragleave', handleDragOut);
      target.removeEventListener('dragover', handleDrag);
      target.removeEventListener('drop', handleDrop);
    };
    // eslint-disable-next-line
  }, [dropRef]);

  return (
    <>
      <div className="drop-target" ref={dropRef} onClick={() => fileInput.current.click()}>
        {children}
      </div>
      <input
        type="file"
        id="file"
        ref={fileInput}
        style={{ display: 'none' }}
        onChange={e => handleFileDrop(e.target.files)}
      />
    </>
  );
}
