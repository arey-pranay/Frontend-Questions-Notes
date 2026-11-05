# Multi-Stepper Component — Interview Notes

## 1. Mental model

A multi-stepper is a controlled sequence of UI panels. The component tracks the active step index and renders the corresponding step, progress indicator, and navigation actions.

```
const [step, setStep] = useState(defaultActive);
```

- `step` identifies the currently displayed step.
- `steps[step]` renders that step's content.
- `step > 0` determines whether Previous is available.
- `step < steps.length - 1` determines whether Next or Submit is shown.

## 2. How the current implementation works

### Progress indicator

```
{steps.map((_, index) => (
  <div
    key={index}
    className={`stepper-step ${index <= step ? "active" : ""}`}
  >
    <div className="step-number">{index + 1}</div>
    {index < steps.length - 1 && (
      <div className={`step-line ${index < step ? "active" : ""}`} />
    )}
  </div>
))}
```

- Maps over the steps to create numbered indicators.
- `index <= step` marks the current and previous steps as active.
- `index < step` activates the connecting line only after moving past that step.
- The index is used as the key; stable step IDs are preferable if steps can change dynamically.

### Step content

```
<div className="stepper-content">
  {steps[step]}
</div>
```

Only the active step is rendered. This means inactive step components unmount, so their local component state may be lost.

### Navigation

```
onClick={() => setStep((prev) => prev - 1)}
onClick={() => setStep((prev) => prev + 1)}
```

Functional state updates use the latest state value. However, the current implementation does not validate bounds, validate step data, or guard against an empty `steps` array.

## 3. Improvements to the current implementation

- Clamp `defaultActive` to a valid index.
- Handle `steps.length === 0`.
- Use a shared `goToStep(index)` function that checks bounds.
- Add validation before advancing.
- Persist form values outside individual step components.
- Use stable IDs instead of array indexes if steps can be inserted or removed.
- Add loading/error states for asynchronous validation.
- Use semantic labels and ARIA attributes for accessibility.
- Add a real submit handler on the final step.

# Follow-up Questions

## 1. How would you allow users to jump directly to a particular step?

Add a `goToStep(index)` function that validates the requested index and updates the active step.

```
function goToStep(index: number) {
  if (index < 0 || index >= steps.length) return;
  setStep(index);
}
```

Then make the progress indicators clickable:

```
<button
  type="button"
  onClick={() => goToStep(index)}
  aria-current={index === step ? "step" : undefined}
>
  {index + 1}
</button>
```

Important design decision: decide whether users may jump to any step or only to steps they have already completed. For a validated wizard, jumping forward may need to validate all skipped steps first.

## 2. How would you support asynchronous validation before moving to the next step?

Make the Next handler asynchronous. Validate the current step, show a pending state, and advance only if validation succeeds.

```
const [isValidating, setIsValidating] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleNext() {
  setIsValidating(true);
  setError(null);

  try {
    const isValid = await validateStep(step, formData);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      setError("Please correct the errors before continuing.");
    }
  } catch {
    setError("Validation failed. Please try again.");
  } finally {
    setIsValidating(false);
  }
}
```

Disable Next while validation is in progress to prevent duplicate requests. The validation function might check server-side availability, username uniqueness, or other data that cannot be validated synchronously.

## 3. How would you persist form data between steps?

Lift form state into the parent stepper or a shared form state provider. Pass each step its values and an update function.

```
const [formData, setFormData] = useState({});

function updateFormData(values) {
  setFormData((prev) => ({ ...prev, ...values }));
}
```

Each step receives:

```
<Step
  data={formData}
  onChange={updateFormData}
/>
```

This preserves values when step components unmount. For persistence across refreshes, save data to `sessionStorage`, `localStorage`, or a backend, depending on privacy and durability requirements.

## 4. How would you implement keyboard navigation between steps?

Support keyboard controls appropriate to the component's interaction model:

- `Tab` and `Shift+Tab` move through normal interactive elements.
- `Enter` may activate Next when the current step is valid.
- Arrow keys can move between step indicators if they are implemented as a tab-like navigation group.
- `Home` and `End` can move to the first and last step indicators.

Avoid hijacking arrow keys globally; handle them only when focus is within the step navigation. After a step change, move focus to the new step's heading or content container.

## 5. How would you support dynamic insertion or removal of steps?

Represent steps as objects with stable IDs rather than relying only on array positions:

```
type Step = {
  id: string;
  title: string;
  content: React.ReactNode;
};
```

Track the active step by ID, then derive its index from the current step list. When a step is removed, choose a sensible fallback—typically the preceding step—or move to the nearest valid step.

Stable IDs prevent React from confusing steps when the array changes. Also reconsider validation rules and saved data when a step is removed.

## 6. How would you animate transitions between steps?

Use CSS transitions or an animation library such as Framer Motion.

A basic CSS approach:

```
.stepper-content {
  animation: step-enter 180ms ease-out;
}

@keyframes step-enter {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stepper-content {
    animation: none;
  }
}
```

For directional transitions, track whether the user moved forward or backward and apply the corresponding animation. With an animation library, use keyed content and `AnimatePresence` to animate exit and entry.

## 7. How would you expose an imperative API like `next()`, `previous()`, and `goToStep(index)` using `ref`?

Expose methods through `useImperativeHandle` and `forwardRef` (React 18 and earlier style):

```
import {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

export type StepperHandle = {
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
};

const MultiStepper = forwardRef<StepperHandle, Props>(
  function MultiStepper({ steps, defaultActive = 0 }, ref) {
    const [step, setStep] = useState(defaultActive);

    function goToStep(index: number) {
      if (index >= 0 && index < steps.length) {
        setStep(index);
      }
    }

    useImperativeHandle(ref, () => ({
      next: () => goToStep(step + 1),
      previous: () => goToStep(step - 1),
      goToStep,
    }), [step, steps.length]);

    // Render stepper...
  }
);
```

A parent can then call:

```
const stepperRef = useRef<StepperHandle>(null);

stepperRef.current?.goToStep(2);
```

If navigation must validate or await server checks, expose asynchronous methods returning `Promise<boolean>` rather than bypassing validation.

## 8. How would you make the component accessible for screen readers?

- Use a semantic `<ol>` for the step list and `<li>` for each step.
- Give each step a meaningful label, not just a number.
- Mark the active step with `aria-current="step"`.
- Use real `<button>` elements for clickable step indicators and navigation.
- Give the active panel an accessible name using `aria-labelledby`.
- Announce step changes with a restrained `aria-live="polite"` region.
- Move focus to the new step heading after navigation.
- Associate validation messages with fields using `aria-describedby`, and mark invalid fields with `aria-invalid`.
- Respect reduced-motion preferences.

Example:

```
<section
  aria-labelledby={`step-title-${step}`}
  aria-live="polite"
>
  <h2 id={`step-title-${step}`} tabIndex={-1}>
    {steps[step].title}
  </h2>
  {steps[step].content}
</section>
```

The central accessibility principle is that users should understand which step they are on, what the step is for, and what happened after they navigated.
