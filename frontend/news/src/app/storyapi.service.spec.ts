import { TestBed } from '@angular/core/testing';

import { StoryapiService } from './storyapi.service';

describe('StoryapiService', () => {
  let service: StoryapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoryapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
