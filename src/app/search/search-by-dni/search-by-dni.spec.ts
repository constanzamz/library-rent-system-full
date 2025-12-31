import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByDni } from './search-by-dni';

describe('SearchByDni', () => {
  let component: SearchByDni;
  let fixture: ComponentFixture<SearchByDni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByDni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchByDni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
