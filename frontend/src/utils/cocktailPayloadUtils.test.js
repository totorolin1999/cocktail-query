import { buildCocktailFormData } from './cocktailPayloadUtils';

describe('buildCocktailFormData', () => {
  it('serializes related fields into JSON strings for the backend parser', () => {
    const formData = buildCocktailFormData({
      chinese_name: 'Mojito',
      english_name: 'Mojito',
      Bases: [{ value: 1, label: 'Rum' }],
      Liqueurs: [{ value: 2, label: 'Mint' }],
    });

    expect(formData.get('chinese_name')).toBe('Mojito');
    expect(formData.get('english_name')).toBe('Mojito');
    expect(formData.get('Chinese_Name')).toBe('Mojito');
    expect(formData.get('English_Name')).toBe('Mojito');
    expect(formData.get('Bases')).toBe(JSON.stringify([{ value: 1 }]));
    expect(formData.get('Liqueurs')).toBe(JSON.stringify([{ value: 2 }]));
  });
});
