const { calculateZodiacCompatibility } = require('./utils/astrology');

console.log("Овен vs Скорпион:", calculateZodiacCompatibility("Овен", "Скорпион")); // Огонь vs Вода
console.log("Телец vs Дева:", calculateZodiacCompatibility("Телец", "Дева"));     // Земля vs Земля
console.log("Близнецы vs Весы:", calculateZodiacCompatibility("Близнецы", "Весы")); // Воздух vs Воздух
console.log("Овен vs Овен:", calculateZodiacCompatibility("Овен", "Овен"));       // Same -> 80 + 30 - 10? wait, logic handles it.

