type Rules = { "only-export-components": any };

export type OnlyExportComponentsOptions = {
  extraHOCs?: string[];
  allowExportNames?: string[];
  allowConstantExport?: boolean;
  allowCompoundComponents?: boolean;
  checkJS?: boolean;
};

type Config = {
  name: string;
  plugins: { "react-refresh": { rules: Rules } };
  rules: Rules;
};
type ConfigFn = (options?: OnlyExportComponentsOptions) => {
  name: string;
  plugins: { "react-refresh": { rules: Rules } };
  rules: Rules;
};

export const reactRefresh: {
  plugin: {
    rules: Rules;
  };
  configs: {
    recommended: ConfigFn;
    vite: ConfigFn;
    next: ConfigFn;
  };
};

declare const defaultExport: {
  rules: Rules;
  configs: {
    recommended: Config;
    vite: Config;
    next: Config;
  };
};
export default defaultExport;
