import { MyDateTimePipe } from './my-date-time.pipe';

describe('MyDateTimePipe', () => {
  it('create an instance', () => {
    const pipe = new MyDateTimePipe();
    expect(pipe).toBeTruthy();
  });
});
