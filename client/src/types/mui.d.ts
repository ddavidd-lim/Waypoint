
// this is needed in some TS configs to make sure the file is treated as a module augmentation rather than a global script
//  (without any import/export, TS can sometimes treat a .d.ts file as global scope instead of augmenting the specific module).
import '@mui/material/IconButton';

declare module '@mui/material/IconButton' {
  // 1. Add the variant prop to the IconButton properties
  interface IconButtonOwnProps  {
    variant?: 'noteMenu'; // Add your custom variant strings here
  }

  // 2. Map the variant to the internal overrides system
  interface IconButtonPropsVariantOverrides {
    noteMenu: true;
  }
}