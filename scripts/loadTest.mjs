import chalk from 'chalk';
import emoji from 'node-emoji';
import { exec } from 'child_process';

let loadTestCommands = [];

for (let i = 1; i <= 30; i++) {
  // Switch to the default identity for admin actions
  loadTestCommands.push({
    command: `dfx identity use default`,
    description: `Switching to default identity...`,
    emoji: emoji.get('key'),
  });

  // Create a new team
  loadTestCommands.push({
    command: `dfx canister call Verifier adminCreateTeam '( "test team ${i}", false )'`,
    description: `Creating Team ${i}...`,
    emoji: emoji.get('triangular_flag_on_post'),
  });

  for (let j = 1; j <= 30; j++) {
    const identityName = `student${j}ofTeam${i}`;

    //Create a new identity
    // if (i > 10 ) {
    // loadTestCommands.push({
    //   command: `dfx identity new ${identityName}`,
    //   description: `Creating Identity ${identityName}...`,
    //   emoji: emoji.get('key'),
    // });
    // }

    // Use the new identity
    loadTestCommands.push({
      command: `dfx identity use ${identityName}`,
      description: `Using Identity ${identityName}...`,
      emoji: emoji.get('key'),
    });

    // Get the principal of the new identity
    loadTestCommands.push({
      command: `dfx identity get-principal`,
      description: `Getting Principal for Identity ${identityName}...`,
      emoji: emoji.get('id'),
      identity: identityName,
    });
  
  //   // Register the student
  //   loadTestCommands.push({
  //     command: `dfx canister call Verifier registerStudent '("${identityName}", "${identityName}", false)'`,
  //     description: `Registering ${identityName} for Team ${i}...`,
  //     emoji: emoji.get('student'),
  //     identity: identityName,
  //   });
  }
}

function executeLoadTestCommands(index = 0) {
  if (index >= loadTestCommands.length) return;

  const command = loadTestCommands[index];

  console.log(chalk.blue(`\n${command.emoji}  ${command.description}\n`));

  exec(command.command, (error, stdout, stderr) => {
    if (error) {
      console.log(`\nError: ${error.message}\n`);
      return;
    }
    if (stderr) {
      console.log(`\nWarning: ${stderr}\n`);
    }

    console.log(`${command.emoji}  ${stdout.trim()}\n`);

    if (command.description.includes("Getting Principal for Identity")) {
      const principal = stdout.trim();
      const identityName = command.identity;

      // Replace the registerStudent command with the correct principal as the first argument
      loadTestCommands[index + 1].command = `dfx canister call Verifier registerStudent '( "${identityName}", "${principal}", false)'`;
    }

    executeLoadTestCommands(index + 1);
  });
}

executeLoadTestCommands();

