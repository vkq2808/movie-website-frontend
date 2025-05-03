// components/LoadingSpinner.tsx
import { ClipLoader } from 'react-spinners';

type LoadingSpinnerProps = {
  size?: number;
};

const LoadingSpinner = ({ size = 50 }: LoadingSpinnerProps) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <ClipLoader color="#36d7b7" size={size} />
  </div>
);

export default LoadingSpinner;
