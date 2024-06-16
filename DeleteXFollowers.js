// Just copy and paste this entire thing into developer console (press F12, then click console tab) you may have to allow pasting if this is your first time. Just follow the instructions inside the console tab.

(() => {
  const $moreButtons = '[aria-label="More"]';
  const $removeFollowerButton = '[data-testid="removeFollower"]';
  const $confirmButton = '[data-testid="confirmationSheetConfirm"]';

  const retry = {
    count: 0,
    limit: 3,
  };

  const scrollToTheBottom = () => window.scrollTo(0, document.body.scrollHeight);
  const retryLimitReached = () => retry.count === retry.limit;
  const addNewRetry = () => retry.count++;

  const sleep = ({ seconds }) =>
    new Promise((proceed) => {
      console.log(`WAITING FOR ${seconds} SECONDS...`);
      setTimeout(proceed, seconds * 1000);
    });

  const remove = async (removeFollowerButton) => {
    removeFollowerButton && removeFollowerButton.click();
    await sleep({ seconds: 1 });
    const confirmButton = document.querySelector($confirmButton);
    confirmButton && confirmButton.click();
    await sleep({ seconds: 2 });
  };

  const removeAll = async (moreButtons) => {
    console.log(`REMOVING ${moreButtons.length} FOLLOWERS...`);
    await Promise.all(
      moreButtons.map(async (moreButton) => {
        moreButton && moreButton.click();
        await sleep({ seconds: 1 });
        const removeFollowerButton = document.querySelector($removeFollowerButton);
        await remove(removeFollowerButton);
      })
    );
  };

  const nextBatch = async () => {
    const moreButtons = Array.from(document.querySelectorAll($moreButtons));
    const moreButtonsWereFound = moreButtons.length > 0;

    if (moreButtonsWereFound) {
      await removeAll(moreButtons);
      scrollToTheBottom();
      await sleep({ seconds: 2 });
      return nextBatch();
    } else {
      addNewRetry();
    }

    if (retryLimitReached()) {
      console.log(`NO FOLLOWERS FOUND, SO I THINK WE'RE DONE`);
      console.log(`RELOAD PAGE AND RE-RUN SCRIPT IF ANY WERE MISSED`);
    } else {
      scrollToTheBottom();
      await sleep({ seconds: 2 });
      return nextBatch();
    }
  };

  nextBatch();
})();
