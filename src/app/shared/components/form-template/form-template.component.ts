import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { filterAndSort } from './helpers/filterAndSort';
import {
  FormValidationUtils,
  passwordMatchValidator,
} from '../../validations/validations-message';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-form-template',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    PasswordModule,
    InputMaskModule,
    KeyFilterModule,
    DividerModule,
    TextareaModule,
    SelectModule,
    CheckboxModule,
    MultiSelectModule,
    ColorPickerModule,
    FloatLabelModule,
  ],
  templateUrl: './form-template.component.html',
  styleUrl: './form-template.component.scss',
})
export class FormTemplateComponent implements OnInit, OnChanges {
  @Input() form: any[] = [];
  @Input() colClass: string = 'col-lg-4 col-md-6 col-sm-12';
  @Input() initialData: any;

  // Inputs que usan tus pantallas
  @Input() width: string = '70rem';
  @Input() title: string = '';
  @Input() isVisible: boolean = false;
  @Input() isEdit: boolean = false;

  formGroup!: FormGroup;
  minDate: Date | null = null;
  maxDate: Date | null = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = filterAndSort(this.form);

    const controls = this.form.reduce((group: any, item: any) => {
      const validators = [];

      if (item.required) validators.push(Validators.required);
      if (item.maxLength) validators.push(Validators.maxLength(+item.maxLength));
      if (item.minLength) validators.push(Validators.minLength(+item.minLength));
      if (item.pattern) validators.push(Validators.pattern(item.pattern));

      const initialValue =
        item.type === 'checkbox'
          ? item.value ?? false
          : item.type === 'multiselect'
            ? item.value ?? []
            : item.value ?? '';

      group[item.name] = [initialValue, validators];
      return group;
    }, {});

    this.formGroup = this.formBuilder.group(controls);

    if (this.formGroup.get('currentPassword') && this.formGroup.get('newPassword')) {
      this.formGroup.setValidators(passwordMatchValidator('newPassword', 'confirmPassword'));
    }

    this.formGroup.get('startDate')?.valueChanges.subscribe((value) => {
      this.minDate = value ? new Date(value) : null;
    });

    this.formGroup.get('endDate')?.valueChanges.subscribe((value) => {
      this.maxDate = value ? new Date(value) : null;
    });

    if (this.initialData) {
      this.formGroup.patchValue(this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']?.currentValue && this.formGroup) {
      this.formGroup.patchValue(changes['initialData'].currentValue);
    }
  }

  get passwordMismatch(): boolean {
    return !!this.formGroup?.errors?.['passwordMismatch'];
  }

  passwordMismatchMessage(): string {
    return FormValidationUtils.passwordMismatchMessage();
  }

  getMultiSelectLabel(controlName: string): string {
    const selectedValues = this.formGroup.get(controlName)?.value || [];
    if (selectedValues.length === 0) return 'Ningún ítem seleccionado';
    if (selectedValues.length <= 3) return selectedValues.map((item: any) => item.nombre || item).join(', ');
    return `Has seleccionado ${selectedValues.length} items`;
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.formGroup.get(controlName);
    return control ? FormValidationUtils.getErrorMessage(control) : null;
  }

  trackByFormField(index: number, item: any): any {
    return item.name || index;
  }
}

