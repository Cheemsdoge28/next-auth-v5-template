import * as React from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: React.ReactNode;
  onComplete?: (otp: string) => void; // Callback function when OTP is complete
}

const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(
  ({ suffix, className, type = "text", onComplete, ...props }, ref) => {
    const [otp, setOtp] = React.useState<string>(""); // State to hold OTP value
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]); // Refs for inputs

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      
      if (value.length > 1) return; // Prevent more than one character in a single input

      const otpArray = otp.split('');
      otpArray[index] = value;
      const newOtp = otpArray.join('');
      setOtp(newOtp);

      if (value.length === 1 && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus(); // Focus next input
      } else if (value === '' && index > 0) {
        inputsRef.current[index - 1]?.focus(); // Focus previous input if deleting
      }

      // Call onComplete if all inputs are filled
      if (newOtp.length === inputsRef.current.length && onComplete) {
        onComplete(newOtp);
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault(); // Prevent default backspace behavior

        if (otp[index] === '' && index > 0) {
          // If the current input is empty and it's not the first input, move focus to the previous input
          inputsRef.current[index - 1]?.focus();
        } else if (otp[index] !== '') {
          // If the current input has a value, clear it and stay focused
          setOtp(prev => prev.slice(0, index) + '' + prev.slice(index + 1));
        }
      }
    };

    return (
      <div className="flex space-x-2 justify-center mt-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="relative flex items-center">
            <input
              type={type}
              maxLength={1}
              className={cn(
                "w-12 h-12 border-2 border-gray-300 rounded-md text-center text-xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform focus:scale-110",
                className
              )}
              value={otp[index] || ''} // Display the character at the current index
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)} // Handle backspace navigation
              ref={(el) => { inputsRef.current[index] = el; }} // Set reference for each input
              aria-label={`OTP input ${index + 1}`} // Accessibility improvement
              {...props} // Spread the remaining props
            />
            {suffix && (
              <div className="absolute right-4 text-sm">
                {suffix}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);

OtpInput.displayName = "OtpInput";

export { OtpInput };
