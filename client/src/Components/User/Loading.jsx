import React from "react";
import "../../PageStyle/LoadingScreen.css"

function Loading(){
    return(
<div className="kitchen-loader">
  <div className="kitchen-counter">
    <div className="chef-hat"></div>
    <div className="sizzling-pan">
      <div className="food-item pizza"></div>
      <div className="food-item burger"></div>
      <div className="food-item sushi"></div>
      <div className="sizzle"></div>
    </div>
    <div className="steam">
      {[...Array(8)].map((_, i) => <div key={i} className="steam-cloud" style={{ '--i': i }}></div>)}
    </div>
  </div>
  <div className="loading-status">
    <span className="cooking-text">Byteeats is cooking...</span>
    <span className="ingredient-bubble">🍅</span>
    <span className="ingredient-bubble">🧀</span>
    <span className="ingredient-bubble">🥬</span>
  </div>
  <div className="progress-spoon">
    <div className="spoon"></div>
    <div className="progress-sauce"></div>
  </div>
</div>
    )
}

export default Loading