import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  delay?: number;
}

const AnimatedNumber = ({
  value,
  duration = 1500,
  suffix = "",
  prefix = "",
  className = "",
  delay = 0,
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);

      if (progress === 1) {
        setDisplayValue(value);
      } else {
        setDisplayValue(Math.floor(easeOutExpo * value));
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, isVisible]);

  const formatNumber = (num: number) => {
    return num.toLocaleString("pt-BR");
  };

  return (
    <span
      className={`inline-block transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } ${className}`}
    >
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
