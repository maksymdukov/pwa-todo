import { makeStyles } from "@material-ui/core/styles";
import { DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";

export const useStyles = makeStyles({
  addBtn: {
    position: "fixed",
    bottom: 20,
    right: 20
  },
});

export const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  // padding: 8,
  width: "100%"
});

export const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  // some basic styles to make the items look a bit nicer
  // padding: 8 * 2,
  margin: `0 0 ${8}px 0`,

  // change background colour if dragging
  // background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});
