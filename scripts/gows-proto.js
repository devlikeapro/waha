// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yargs = require('yargs');

// Defaults
const CONFIG_FILE = 'waha.config.json';
// Load defaults from package.json
gows = (() => {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return config.waha.gows || {};
  } catch (error) {
    return {};
  }
})();

const DEFAULT_REPO = gows.repo;
if (!DEFAULT_REPO) {
  throw new Error(`Missing default repo in ${CONFIG_FILE}`);
}
const DEFAULT_REF = gows.ref;
if (!DEFAULT_REF) {
  throw new Error('Missing default ref in ${CONFIG_FILE}');
}
const DEFAULT_DIR = './src/core/engines/gows/proto';

const PROTO_FILES = ['gows.proto'];
const PROTO_OUTPUT = './src/core/engines/gows/grpc';

// Helper function to clean directory
function cleanDirectory(directory, suffix) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    return;
  }

  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    if (file.endsWith(suffix)) {
      fs.unlinkSync(filePath);
    }
  }
}

// Helper function to download files
async function downloadFiles(repo, ref, directory) {
  for (const file of PROTO_FILES) {
    const url = `https://github.com/${repo}/releases/download/${ref}/${file}`;
    // Forks built from source have no releases: fall back to the file in the repo
    const rawUrl = `https://raw.githubusercontent.com/${repo}/${ref}/proto/${file}`;
    const filePath = path.join(directory, file);
    try {
      const response = await axios
        .get(url, { responseType: 'arraybuffer' })
        .catch(() => axios.get(rawUrl, { responseType: 'arraybuffer' }));
      fs.writeFileSync(filePath, response.data);
      console.log(`Downloaded: ${file}`);
    } catch (error) {
      console.error(`Failed to download ${file}: ${error.message}`);
    }
  }
}

// Handler for fetch command
async function handleFetch(repo, ref, dir) {
  console.log(`Fetching .proto files from ${repo}@${ref} to ${dir}...`);
  cleanDirectory(dir, '.proto');
  await downloadFiles(repo, ref, dir);
}

// Handler for build command
function handleBuild(dir) {
  console.log('Building gRPC files...');
  cleanDirectory(PROTO_OUTPUT);

  const command = `grpc_tools_node_protoc \
        --plugin=protoc-gen-ts=node_modules/.bin/protoc-gen-ts \
        --plugin=protoc-gen-grpc=node_modules/.bin/grpc_tools_node_protoc_plugin \
        --js_out=import_style=commonjs,binary:${PROTO_OUTPUT} \
        --grpc_out=grpc_js:${PROTO_OUTPUT} \
        --ts_out=grpc_js:${PROTO_OUTPUT} \
        -I ${dir} ${dir}/gows.proto`;

  try {
    execSync(command, { stdio: 'inherit' });
    console.log('gRPC files built successfully.');
  } catch (error) {
    console.error(`Failed to build gRPC files: ${error.message}`);
  }
}

//
// Commands
//

// fetch
yargs.command(
  'fetch',
  'Fetch .proto files from GitHub',
  (yargs) => {
    yargs
      .option('repo', {
        describe: 'GitHub repository (owner/repo)',
        type: 'string',
        default: DEFAULT_REPO,
      })
      .option('ref', {
        describe: 'Git reference (branch or commit SHA)',
        type: 'string',
        default: DEFAULT_REF,
      })
      .option('dir', {
        describe: 'Directory to output .proto files',
        type: 'string',
        default: DEFAULT_DIR,
      });
  },
  async (argv) => {
    await handleFetch(argv.repo, argv.ref, argv.dir);
  },
);

// build
yargs.command(
  'build',
  'Build gRPC files from .proto files',
  (yargs) => {
    yargs.option('dir', {
      describe: 'Directory containing .proto files',
      type: 'string',
      default: DEFAULT_DIR,
    });
  },
  (argv) => {
    handleBuild(argv.dir);
  },
);

// Parse arguments
yargs.parse();
