// import GradientButton from "@/components/ui/button-1";

// const DemoOne = () => {
//   return (
//     <div className="flex w-full h-screen justify-center items-center">
//       <GradientButton
//         onClick={() => console.log('clicked')}
//         width="300px"
//         height="60px"
//         disabled={false}
//       >
//         Button
//       </GradientButton>
//     </div>
//   );
// };

// export { DemoOne };

// 'use client';

// const GradientButton = ({
//   children,
//   width = '600px',
//   height = '100px',
//   className = '',
//   onClick,
//   disabled = false,
//   ...props
// }) => {
//   const commonGradientStyles = `
//     relative rounded-[50px] cursor-pointer
//     after:content-[""] after:block after:absolute after:bg-[var(--color-background)]
//     after:inset-[5px] after:rounded-[45px] after:z-[1]
//     after:transition-opacity after:duration-300 after:ease-linear
//     flex items-center justify-center
//     ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
//   `;

//   const handleKeyDown = (e) => {
//     if (disabled) return;
//     if (e.key === 'Enter' || e.key === ' ') {
//       e.preventDefault();
//       onClick && onClick();
//     }
//   };

//   return (
//     <div className="text-[#eee] text-center">
//       <div
//         role="button"
//         tabIndex={disabled ? -1 : 0}
//         className={`
//           ${commonGradientStyles}
//           rotatingGradient
//           ${className}
//         `}
//         style={{
//           '--r': '0deg',
//           minWidth: width,
//           height: height
//         }}
//         onClick={disabled ? undefined : onClick}
//         onKeyDown={handleKeyDown}
//         aria-disabled={disabled}
//         {...props}
//       >
//         <span className="relative z-10 text-[var(--color-text)] flex items-center justify-center label">
//           {children}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default GradientButton;
