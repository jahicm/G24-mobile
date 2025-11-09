import {PriorityLevel, SmartInsight } from './smart-insight';

describe('SmartInsight', () => {
  it('should create an instance', () => {
    const insight = new SmartInsight(
      'Sample text',
      'Translated text',
      'General context',
      'medium' as PriorityLevel
    );
    expect(insight).toBeTruthy();
  });
});
