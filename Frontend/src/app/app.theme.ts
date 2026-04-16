import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const Noir = definePreset(Aura, {
   semantic: {
        primary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{surface.950}',
                    inverseColor: '#ffffff',
                    hoverColor: '{surface.800}',
                    activeColor: '{surface.700}'
                },
                highlight: {
                    background: '{surface.950}',
                    focusBackground: '{surface.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '{surface.0}',
                    inverseColor: '{surface.950}',
                    hoverColor: '{surface.200}',
                    activeColor: '{surface.300}'
                },
                highlight: {
                    background: '{surface.0}',
                    focusBackground: '{surface.300}',
                    color: '{surface.950}',
                    focusColor: '{surface.950}'
                }
            }
        }
    }
});