import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      titleHome: ['', Validators.required],
      pForTitle: ['', Validators.required],
      cvLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
      aboutMe: ['', Validators.required],
      linkedInLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
      softSkill: [''], 
      techSkill: [''], 
      projects: this.fb.array([])
    });
  }

  projects(): FormArray {
    return this.userForm.get('projects') as FormArray;
  }

  addProject() {
    const projectGroup = this.fb.group({
      projectTitle: ['', Validators.required],
      projectDescription: ['', Validators.required],
      projectImage: [''],
      projectLink: ['']
    });
    this.projects().push(projectGroup);
  }

  removeProject(index: number) {
    this.projects().removeAt(index);
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    const formData = this.userForm.value;
    formData.softSkill = formData.softSkill.split(',').map((skill: string) => skill.trim());
    formData.techSkill = formData.techSkill.split(',').map((skill: string) => skill.trim());

    const token = localStorage.getItem('authToken'); 

    if (!token) {
      alert('Please log in to continue.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });

    try {
      await this.http.post('http://localhost:3000/api/user', formData, { headers }).toPromise();
      alert('Data successfully submitted!');
      this.router.navigate(['/success']); 
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  }
}
