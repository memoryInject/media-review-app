import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';

import {
  ArrowDrawable,
  CircleDrawable,
  FreePathDrawable,
} from '../utils/drawables';

import dataURLtoFile from '../utils/dataURLtoFile';

import {
  isEmptyAnnotation,
  exportImageAnnotation,
} from '../actions/annotationActions';

const AnnotationCanvas = () => {
  const [drawables, setDrawables] = useState([]);
  const [newDrawable, setNewDrawable] = useState([]);
  const [combine, setCombine] = useState([]);
  const [info, setInfo] = useState([]);

  const stageRef = useRef(null);

  const dispatch = useDispatch();

  const playerDetails = useSelector((state) => state.playerDetails);
  const { height, width } = playerDetails;

  const annotationDeatils = useSelector((state) => state.annotationDeatils);
  const { drawableType, isEmpty, color, image } = annotationDeatils;

  useEffect(() => {
    dispatch(isEmptyAnnotation(true));
  }, [dispatch]);

  useEffect(() => {
    if (drawables.length !== 0) {
      dispatch(isEmptyAnnotation(false));
    } else {
      dispatch(isEmptyAnnotation(true));
    }
  }, [dispatch, drawables.length]);

  useEffect(() => {
    if (isEmpty) {
      setCombine([]);
      setDrawables([]);
      setNewDrawable([]);
    }
  }, [isEmpty]);

  useEffect(() => {
    if (image && image.export) {
      const uri = stageRef.current.toDataURL();
      const file = dataURLtoFile(uri, 'image.png');
      dispatch(exportImageAnnotation(file));
    }
  }, [dispatch, image]);

  const getNewDrawableBasedOnType = (x, y, type) => {
    const drawableClasses = {
      ArrowDrawable,
      CircleDrawable,
      FreePathDrawable,
    };

    return new drawableClasses[type](x, y, color);
  };

  const handleMouseDown = (e) => {
    if (newDrawable.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      //const drawable = new ArrowDrawable(x, y);
      const drawable = getNewDrawableBasedOnType(x, y, drawableType);
      setNewDrawable([drawable]);
      setCombine([...drawables, ...newDrawable]);
    }
  };

  const handleMouseUp = (e) => {
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const drawableToAdd = newDrawable[0];
      drawableToAdd.registerMovement(x, y);
      drawables.push(drawableToAdd);
      setNewDrawable([]);
      setDrawables(drawables);

      const infoData = {
        startx: drawableToAdd.startx,
        starty: drawableToAdd.starty,
        x: drawableToAdd.x,
        y: drawableToAdd.y,
      };
      setInfo([...info, infoData]);
    }
  };

  const handleMouseMove = (e) => {
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const updatedNewDrawable = newDrawable[0];
      updatedNewDrawable.registerMovement(x, y);
      setNewDrawable([updatedNewDrawable]);
      setCombine([...drawables, ...newDrawable]);
    }
  };

  return (
    <div>
      <div className='konva-container'>
        <Stage
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          width={width}
          height={height}
          ref={stageRef}
          style={{
            //backgroundColor: 'rgba(0, 255, 0, 0.3)',
            display: 'inlineBlock',
          }}
        >
          <Layer>
            {combine.map((drawable, i) => {
              return drawable.render(i);
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default AnnotationCanvas;
