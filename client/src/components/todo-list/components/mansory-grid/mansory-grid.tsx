import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useMansoryGrid } from "hooks/use-mansory-grid";
import { throttle } from "lodash";

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    position: "relative",
    margin: "auto",
  },
  item: {
    position: "absolute",
    border: "1px solid black",
  },
  hiddenContainer: {
    position: "absolute",
    visibility: "hidden",
  },
}));

interface MansoryGridProps {
  children: JSX.Element[];
  itemMargin: number;
  itemWidth: number;
}

const MansoryGrid = ({ children, itemMargin, itemWidth }: MansoryGridProps) => {
  const classes = useStyles();

  const {
    calculateLayout,
    getHiddenItemStyle,
    getItemStyle,
    setHiddenItemRef,
    getContainerStyle,
    calculatedCount,
  } = useMansoryGrid({ itemMargin, itemWidth });

  useEffect(() => {
    const handleResize = throttle(
      (e) => {
        calculateLayout();
      },
      100,
      {
        trailing: true,
        leading: false,
      }
    );
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, [calculateLayout]);

  const childrenLength = React.Children.count(children);

  const chidlrenWithRefs = childrenLength
    ? React.Children.map(children, function (child, idx) {
        return React.cloneElement(child, {
          ref: setHiddenItemRef(idx),
          style: getHiddenItemStyle(),
        });
      })
    : null;

  // If not yet calculated then do not render real items
  const positionedChildren =
    calculatedCount !== 0 && childrenLength
      ? React.Children.map(children, function (child, idx) {
          return React.cloneElement(child, {
            style: getItemStyle(idx),
          });
        })
      : null;

  useEffect(() => {
    if (React.Children.count(children)) {
      calculateLayout();
    }
  }, [children, calculateLayout]);

  return (
    <section>
      <div className={classes.container} style={getContainerStyle()}>
        <div className={classes.hiddenContainer}>{chidlrenWithRefs}</div>

        {positionedChildren}
      </div>
    </section>
  );
};

export default MansoryGrid;
