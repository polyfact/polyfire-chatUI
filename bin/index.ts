import { Command, program } from 'commander';
import { exec } from 'child_process';
import { generate } from 'polyfact';
import path from 'path';
import fs from 'fs';

function extractConfig(data: string) {
  let startIndex = data.indexOf('const config: Config = {');
  if (startIndex === -1) {
    throw new Error("'const config: Config = {' not found.");
  }

  data = data.substring(startIndex);

  let lastIndex = data.lastIndexOf('}');
  if (lastIndex === -1) {
    throw new Error("Last '}' not found.");
  }

  data = data.substring(0, lastIndex + 1);

  return data;
}

program
  .version('1.0.0')
  .description(
    'Download a template from Github and optionally generate a theme.'
  );

const applyGlobalOptions = (command: Command) => {
  return command
    .option('-k, --token <type>', 'Set POLYFACT_TOKEN')
    .option('-m, --model <type>', 'Set Model Name', 'gpt-4')
    .option('--maxTokens <number>', 'Set Max Tokens In Response')
    .option(
      '-t, --topic <topic>',
      'Topic to generate a theme for',
      'love, romantics, Sweety'
    )
    .option('-n, --name <repo name>', 'Name of the repository to clone')
    .option('-b, --bot <bot name>', 'Name of the bot that you want', 'ChatBot')
    .option(
      '-p, --prompt <prompt id>',
      'System Prompt ID to load a shared prompt'
    );
};

applyGlobalOptions(program)
  .description('Download the polyfact chat template from Github.')
  .action(async options => {
    if (!options.polyfactToken) {
      console.error('POLYFACT_TOKEN is required.');
      process.exit(1);
    }

    try {
      const repoURL = 'https://github.com/kevin-btc/polyfact-chat-template.git';

      const repo = options?.name ?? 'polyfact-chat-template';

      exec(`git clone ${repoURL} ${repo}`, error => {
        if (error) {
          console.error(`Error cloning the repository: ${error}`);
          return;
        }

        console.log('Repository cloned successfully.');
      });

      if (options?.topic) {
        console.log('Generating a theme for the chatbot...');

        const prompt = `
        From this short description: 
        "${options?.topic || 'love, romantics, Sweety'}"

        Detect the topic from this one and generate a theme with relevant and complentary colors and adding the colors in this object:
        const config: Config = {
            header: {
              logo: "./logo.svg",
              bgColor: "",
              textColor: "",
            },
            chat: {
              chatBackgroundColor: "",
              chatTextColor: "",
              inputBackgroundColor: "",
              inputColor: "",
              placeholderTextColor: "",
              botMessageColor: "",
              botMessageBackgroundColor: "",
              userMessageColor: "",
              userMessageBackgroundColor: "",
              botName: "ChatBot",
              buttonBackgroundColor: "",
              buttonBorderColor: "",
              buttonBorderWidth: "1px",
              dotsColor: "",
              promptId: "${options.prompt ??
                '49735ec7-6c20-4ceb-9741-3de1db4fe6cd'}",
            },
            footer: {
              bgColor: "",
              textColor: "",
            },
          };


          It's important to answer only the object and nothing else.
          In botName property, add this bot name ${options?.bot || 'ChatBot'}.

          Assistant: Sure! Here is the theme in the config object:
        `;

        console.log('Prompt: ', prompt);

        const res = (await generate(
          prompt,
          { model: options?.model ?? 'gpt-4' },
          { token: options.polyfactToken }
        ).catch(e => {
          console.error(`Error during OpenAI request: ${e.message}`);
          process.exit(1);
        })) as string;

        console.log('Theme generated: ', res);

        try {
          const filePath = path.join(repo, 'src/config.ts');
          fs.readFile(path.join(filePath), 'utf8', (err: any, data: string) => {
            if (err) {
              console.error('Error reading the file:', err);
              return;
            }

            const updatedContent = data.replace(
              /\/\/ \[start\](.*?)\[end\]/gs,
              extractConfig(res)
            );

            fs.writeFile(filePath, updatedContent, 'utf8', err => {
              if (err) {
                console.error('Error writing to the file:', err);
                return;
              }

              console.log(
                'Config file updated successfully with the new theme!'
              );

              console.log(
                `You can now make "cd ${repo} ; npm install ; npm run dev" to start the chatbot.`
              );
            });
          });
        } catch (e) {
          console.error(`Error parsing the response: ${e.message}`);
          console.error("The theme wasn't generated.");
        }
      }
    } catch (error) {
      console.error(`Error downloading the template: ${error}`);
    }
  });

program.parse(process.argv);
