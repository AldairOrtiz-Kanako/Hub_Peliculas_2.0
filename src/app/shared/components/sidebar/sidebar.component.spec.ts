import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isModalVisible as false', () => {
    expect(component.isModalVisible).toBeFalse();
  });

  it('should show modal', () => {
    component.showModal();
    expect(component.isModalVisible).toBeTrue();
  });

  it('should hide modal', () => {
    component.isModalVisible = true;
    component.hideModal();
    expect(component.isModalVisible).toBeFalse();
  });

  it('should toggle modal visibility', () => {
    expect(component.isModalVisible).toBeFalse();

    component.showModal();
    expect(component.isModalVisible).toBeTrue();

    component.hideModal();
    expect(component.isModalVisible).toBeFalse();
  });
});
