const readlineSync = require('readline-sync');

const naves = [
    { NOME: "Lunar Vengeance", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0 },
    { NOME: "Phantom", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0 },
    { NOME: "Titanium Drift", VELOCIDADE: 2, MANOBRABILIDADE: 5, PODER: 3, PONTOS: 0 },
    { NOME: "Starkiller", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
    { NOME: "Nebula", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0 },
    { NOME: "Vortex", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 }
];

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;
    default:
      result = "CONFRONTO";
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
}


function selecionarNave() {
  console.log(`\nA corrida vai começar🏁🚨| Selecione a sua nave: \n\n${naves.map((nave, index) => `${index + 1}. ${nave.NOME}`).join("\n")}\n`);
  
  let selecaoNave = readlineSync.question("Escolha a sua nave [Numero]: ");
  const indiceSelecionado = parseInt(selecaoNave) - 1;

  if (indiceSelecionado >= 0 && indiceSelecionado < naves.length) {
    console.log(`\n${naves[indiceSelecionado].NOME} Foi selecionada:\n`);
    console.log(`-------Status-------\n| Poder: ${naves[indiceSelecionado].PODER}\n| Velocidade :${naves[indiceSelecionado].VELOCIDADE}\n| Manobrabilidade :${naves[indiceSelecionado].MANOBRABILIDADE}\n--------------------`);
    return naves[indiceSelecionado];
  } else {
    console.log("Seleção incorreta. Por favor, escolha um número entre 1 e 6.");
    return selecionarNave();  
  }
}

function escolherNaveCPU() {
  const indiceAleatorio = Math.floor(Math.random() * naves.length);
  return naves[indiceAleatorio];
}

function pause(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function playRaceEngine(player, cpu) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);

    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();
  
    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    if (block === "RETA") {
      totalTestSkill1 = diceResult1 + player.VELOCIDADE;
      totalTestSkill2 = diceResult2 + cpu.VELOCIDADE;

      await logRollResult(player.NOME, "velocidade", diceResult1, player.VELOCIDADE);
      await logRollResult(cpu.NOME, "velocidade", diceResult2, cpu.VELOCIDADE);
    }

    if (block === "CURVA") {
      totalTestSkill1 = diceResult1 + player.MANOBRABILIDADE;
      totalTestSkill2 = diceResult2 + cpu.MANOBRABILIDADE;

      await logRollResult(player.NOME, "manobrabilidade", diceResult1, player.MANOBRABILIDADE);
      await logRollResult(cpu.NOME, "manobrabilidade", diceResult2, cpu.MANOBRABILIDADE);
    }

    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + player.PODER;
      let powerResult2 = diceResult2 + cpu.PODER;

      console.log(`${player.NOME} confrontou com ${cpu.NOME}! 🥊`);

      await logRollResult(player.NOME, "poder", diceResult1, player.PODER);
      await logRollResult(cpu.NOME, "poder", diceResult2, cpu.PODER);

      if (powerResult1 > powerResult2 && cpu.PONTOS > 0) {
        console.log(`${player.NOME} venceu o confronto! ${cpu.NOME} perdeu 1 ponto 🔫`);
        cpu.PONTOS--;
      }

      if (powerResult2 > powerResult1 && player.PONTOS > 0) {
        console.log(`${cpu.NOME} venceu o confronto! ${player.NOME} perdeu 1 ponto 🔫`);
        player.PONTOS--;
      }

      console.log(powerResult2 === powerResult1 ? "Confronto empatado! Nenhum ponto foi perdido" : "");
    }

 
    if (totalTestSkill1 > totalTestSkill2) {
      console.log(`${player.NOME} marcou um ponto!`);
      player.PONTOS++;
    } else if (totalTestSkill2 > totalTestSkill1) {
      console.log(`${cpu.NOME} marcou um ponto!`);
      cpu.PONTOS++;
    }

    console.log("-----------------------------");

    
    await pause(5000); 
  }
}

async function declareWinner(player, cpu) {
  console.log("Resultado final:");
  console.log(`${player.NOME}: ${player.PONTOS} ponto(s)`);
  console.log(`${cpu.NOME}: ${cpu.PONTOS} ponto(s)`);

  if (player.PONTOS > cpu.PONTOS)
    console.log(`\n${player.NOME} venceu a corrida! Parabéns! 🏆`);
  else if (cpu.PONTOS > player.PONTOS)
    console.log(`\n${cpu.NOME} venceu a corrida! Parabéns! 🏆`);
  else console.log("A corrida terminou em empate");
}

(async function main() {
  console.log("🏁🚨 Corrida de Naves começando...\n");

  const player = selecionarNave(); 
  const cpu = escolherNaveCPU(); 

  console.log(`A CPU escolheu a nave ${cpu.NOME}\n`);

  await playRaceEngine(player, cpu);
  await declareWinner(player, cpu);
})();
