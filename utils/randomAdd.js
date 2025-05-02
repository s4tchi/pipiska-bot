function randomAdd() {
  const mr = Math.floor(Math.random() * 100);

  if (mr < 20) {
    const a = Math.floor((mr % 10) / 2);

    return -a - 1;
  }

  return (mr % 10) + 1;
}

module.exports = randomAdd;
