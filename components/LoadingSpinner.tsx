// components/LoadingSpinner.tsx

const LoadingSpinner = () => (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-l-4 border-green-600 border-t-transparent border-b-transparent border-opacity-75"
      ></div>
    </div>
  );
  
  export default LoadingSpinner;
  