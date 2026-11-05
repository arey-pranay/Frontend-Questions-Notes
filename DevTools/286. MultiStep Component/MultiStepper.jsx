
import { useState } from "react";

function MultiStepper({ defaultActive = 0, unmountOnHide, steps }) {
  const [step, setStep] = useState(defaultActive);

  return (
    <div className="stepper-container">
      <div className="stepper-progress">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`stepper-step ${index <= step ? "active" : ""
              }`}
          >
            <div className="step-number">
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`step-line ${index < step ? "active" : ""
                }`} />
            )}
          </div>
        ))}
      </div>

      <div className="stepper-content">
        {steps[step]}
      </div>

      <div className="stepper-actions">
        {step > 0 && (
          <button
            className="stepper-btn prev-btn"
            onClick={() => setStep((prev) => prev - 1)}
          >
            Previous
          </button>
        )}

        {step < steps.length - 1 ? (
          <button
            className="stepper-btn next-btn"
            onClick={() => setStep((prev) => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button className="stepper-btn submit-btn">
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default MultiStepper;
