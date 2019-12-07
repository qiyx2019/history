const execSteps = (steps, history, done) => {
  let index = 0,
    unlisten,
    cleanedUp = false;

  let cleanup = (...args) => {
    if (!cleanedUp) {
      cleanedUp = true;
      unlisten();
      done(...args);
    }
  };

  let execNextStep = (...args) => {
    try {
      let nextStep = steps[index++];

      if (!nextStep) throw new Error('Test is missing step ' + index);

      nextStep(...args);

      if (index === steps.length) cleanup();
    } catch (error) {
      cleanup(error);
    }
  };

  if (steps.length) {
    unlisten = history.listen(execNextStep);

    execNextStep({
      action: history.action,
      location: history.location
    });
  } else {
    done();
  }
};

export default execSteps;