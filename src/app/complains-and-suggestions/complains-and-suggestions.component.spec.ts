import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainsAndSuggestionsComponent } from './complains-and-suggestions.component';

describe('ComplainsAndSuggestionsComponent', () => {
  let component: ComplainsAndSuggestionsComponent;
  let fixture: ComponentFixture<ComplainsAndSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainsAndSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainsAndSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
