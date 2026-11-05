import MultiStepper from "./MultiStepper";

function StepOne() {
  return (
    <div>
      <h2>Personal Information</h2>
      <input placeholder="Name" />
    </div>
  );
}

function StepTwo() {
  return (
    <div>
      <h2>Address Information</h2>
      <input placeholder="Address" />
    </div>
  );
}

function StepThree() {
  return (
    <div>
      <h2>Confirmation</h2>
      <p>Review and submit.</p>
    </div>
  );
}

export default function App() {
  return (
    <MultiStepper
      defaultActive={0}
      unmountOnHide={false}
      steps={[
        <StepOne key="1" />,
        <StepTwo key="2" />,
        <StepThree key="3" />,
      ]}
    />
  );
}
