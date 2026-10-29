import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [RouterLink, CodeBlockComponent],
  templateUrl: './installation.component.html',
  styleUrls: ['../../shared/styles/doc-page.css', './installation.component.css'],
})
export class InstallationComponent {
  readonly npmInstallSnippet = `npm install vayzen-ui`;

  readonly globalTokensSnippet = `/* src/styles.scss o src/styles.css */
:root {
  /* Paleta Primaria de Marca */
  --vz-primary: #0284c7;
  --vz-primary-hover: #0369a1;
  --vz-primary-active: #075985;
  --vz-primary-contrast: #ffffff;

  /* Radios y Superficies Globales */
  --vz-radius-md: 0.5rem;
  --vz-surface: #ffffff;
  --vz-border: #e2e8f0;
}`;

  readonly standaloneUsageSnippet = `import { Component } from '@angular/core';
import {
  VzButtonComponent,
  VzCardComponent,
  VzCardHeaderDirective,
  VzCardTitleDirective,
  VzCardContentDirective,
} from 'vayzen-ui';

@Component({
  selector: 'app-panel-escolar',
  standalone: true,
  imports: [
    VzButtonComponent,
    VzCardComponent,
    VzCardHeaderDirective,
    VzCardTitleDirective,
    VzCardContentDirective,
  ],
  template: \`
    <vz-card variant="elevated" [hoverable]="true">
      <div vzCardHeader>
        <h3 vzCardTitle>Bienvenido a Vayzen UI</h3>
      </div>
      <div vzCardContent>
        <p>Integración lista con cero dependencias externas.</p>
        <vz-button variant="primary">Continuar</vz-button>
      </div>
    </vz-card>
  \`,
})
export class PanelEscolarComponent {}`;
}
