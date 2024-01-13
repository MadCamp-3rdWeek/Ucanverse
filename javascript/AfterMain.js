function handleMouseOver(card) {
    card.querySelector('img').style.filter = 'brightness(70%)';
    card.querySelector('.overlay-text').style.display = 'block';
}

function handleMouseOut(card) {
    card.querySelector('img').style.filter = 'brightness(100%)';
    card.querySelector('.overlay-text').style.display = 'none';
}

function handleStarClick(star) {
    const starimg = star.querySelector('img')
    if( starimg.src.includes('green')){
        star.querySelector('img').src = "../images/graystar.png";
    }else{
        star.querySelector('img').src = "../images/greenstar.png";
    }
    
}