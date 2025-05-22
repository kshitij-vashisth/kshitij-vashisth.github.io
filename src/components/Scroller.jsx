import './scroller.css'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Scroller = ({ texts }) => {
    const { contextSafe } = useGSAP();
    const sandwichedText = texts
        .map((text) => `<div class="marquee">
                    <h1>${text}</h1>
                    <img src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg" alt="" srcset="" />
                </div>`);
    const repeatedText = Array(15).fill(sandwichedText)

    const marqueeRight = contextSafe(
        function scrollDown() {
        gsap.to(".marquee", {
            transform: 'translateX(-200%)',
            duration: 4,
            repeat: -1,
            ease: "none"
        });

        gsap.to(".marquee img", {
            rotate: 180,
            duration:2
        });
    }
    );

    const marqueeLeft = contextSafe(
        function scrollUp() {
        gsap.to(".marquee", {
            transform: 'translateX(0%)',
            duration: 4,
            repeat: -1,
            ease: "none"
        });

        gsap.to(".marquee img", {
            rotate: 0,
            duration:2
        });
    }
    );

    let lastScrolltop = window.scrollY;

window.addEventListener("scroll", function () {
    const currentScrollTop = window.scrollY;

    if (currentScrollTop > lastScrolltop) {
        console.log("Scroll down");
        marqueeRight();
    }
    else if (currentScrollTop < lastScrolltop) {
        console.log("Scrolled up");
        marqueeLeft();
    }

    lastScrolltop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});

return (
    <div id="page1">
        <div id="move" className='mb-[-2vh]' style={{
            whiteSpace: "nowrap",
            willChange: "transform", // helpful for GPU optimization
        }}
            dangerouslySetInnerHTML={{ __html: repeatedText }}>
        </div>
    </div>
)

}



export default Scroller;