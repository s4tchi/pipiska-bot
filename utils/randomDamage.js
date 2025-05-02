function randomDamage() {
  const mr = Math.floor(Math.random() * 200);

  const d = mr % 100;

  let damage = 0;
  if (d < 35) {
    damage = 1;
  }
  if (d >= 35 && d < 60) {
    damage = 2;
  }
  if (d >= 60 && d < 75) {
    damage = 3;
  }
  if (d >= 75 && d < 90) {
    damage = 4;
  }
  if (d >= 90) {
    damage = 5;
  }

  return mr >= 100 ? damage : -damage;
}

module.exports = randomDamage;
