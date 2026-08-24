import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`transition-all duration-1000 ${show? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
    >
      {children}
    </div>
  );
}