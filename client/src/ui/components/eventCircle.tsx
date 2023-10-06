// import { useEffect, useState } from "react";

// import { gameCircleEvent } from "../../phaser/systems/eventSystems/eventEmitter";

// import { EntityIndex, getComponentValue} from "@latticexyz/recs";

// import { CAMERA_ID } from "../../phaser/constants";
// import { PhaserLayer } from "../../phaser";

// type Props = {
//   layer: PhaserLayer;
// };

// //depricated

// export const circleEvent = ({ layer }: Props) =>{

//   const {
//     scenes: {
//       Main: {camera},
//     },
//     networkLayer: {
//       components: {
//         ClientCameraPosition,
//       },
//     },
//   } = layer;

//   const [worldPos, setWorldPos] = useState({ x: 0, y: 0 });
//   const [isVisible, setIsVisible] = useState(false);
//   const [radius, setRadius] = useState(0);

//   const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
//   const [checkDefined, setCheckDefined] = useState(false);

//   useEffect(() => {

//     const updateCirclePosition = () => {

//       if (!isVisible) return;
      
//       const currentCameraPos = getComponentValue(
//         ClientCameraPosition,
//         CAMERA_ID as EntityIndex
//       );  
      
//       if (!currentCameraPos)
//        {
//         setCheckDefined(false);
//         return;
//        }
//        else 
//        {
//         setCheckDefined(true);
//        }

//       if (currentCameraPos)
//       {
//         const cameraWidth = camera.phaserCamera.width;
//         const cameraHeight = camera.phaserCamera.height;

//         const cameraWorldOriginPoint = {
//           x: currentCameraPos.x - cameraWidth / 2,
//           y: currentCameraPos.y - cameraHeight / 2,
//         };

//         setCurrentPos({
//           x: worldPos.x - cameraWorldOriginPoint.x,
//           y: worldPos.y - cameraWorldOriginPoint.y,
//         });
//       }
//     };

//     gameCircleEvent.on("spawnCircle", spawnCircle);
//     gameCircleEvent.on("setCircleState", setCircleState);

//     const intervalID = setInterval(updateCirclePosition, 1000 / 60);  // this si i think the fps

//     return () => {
//       gameCircleEvent.off("spawnCircle", spawnCircle);
//       gameCircleEvent.off("setCircleState", setCircleState);
//       clearInterval(intervalID);
//     };
//   }, [radius, worldPos, isVisible]);

//   const setCircleState = (state: boolean) => 
//   { 
//     setIsVisible(state) 
//   }

//   const spawnCircle = (x: number, y: number, radius:number) => 
//   {
//     setRadius(radius);
//     setWorldPos({ x: x-radius, y: y-radius });
//     setIsVisible(true);
//   } 

//   if (!isVisible || !checkDefined) {
//     return null;
//   }

//   //depends on where the origin is in css might need to do position - radius to center correctly

//   const style: React.CSSProperties = {
//     position: "absolute",
//     left: `${currentPos.x }px`,
//     top: `${currentPos.y}px`, 
//     width: `${radius * 2}px`,
//     height: `${radius * 2}px`,
//     borderRadius: "50%",
//     border: '2px solid red', 
//     backgroundColor: 'transparent', 
//     zIndex: '-2'
//   };
  
//   return <div style={style}></div>;
// };




