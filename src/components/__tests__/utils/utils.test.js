import {
  tag,
  required,
  isEmpty,
  minLength,
  maxLength,
  objectIsEmpty,
  postcardDimensions,
  postcardDimensionsDisplayed,
  iframeDimensions,
  strippedKWKLY,
} from '../../utils/utils';

it('Returns correct tag types', () => {
  const requiredTag = tag('Required');
  expect(requiredTag).toMatchInlineSnapshot(`
    <span
      style={
        Object {
          "fontWeight": 700,
        }
      }
    >
      (Required)
      <span
        style={
          Object {
            "color": "#db2828",
            "margin": "-.2em 0 0 .2em",
          }
        }
      >
        *
      </span>
    </span>
  `);
  const OptionalTag = tag('Optional');
  expect(OptionalTag).toMatchInlineSnapshot(`
    <span
      style={
        Object {
          "fontWeight": 700,
        }
      }
    >
      (Optional)
    </span>
  `);
  const DreTag = tag('Dre');
  expect(DreTag).toMatchInlineSnapshot(`
    <span
      style={
        Object {
          "fontWeight": 700,
        }
      }
    >
      (Required in California)
    </span>
  `);
  const NoTag = tag('');
  expect(NoTag).toMatchInlineSnapshot(`
    <span>
       
    </span>
  `);
  expect(tag('NotATagValue')).toEqual(undefined);
});

it('Returns required for empty values', () => {
  expect(required('Something')).toEqual(undefined);
  expect(required('')).toEqual('Required');
});

it('Returns isEmtpty for empty values', () => {
  expect(isEmpty('NotEmpty')).toBe(false);
  expect(isEmpty('')).toBe(true);
  expect(isEmpty(null)).toBe(true);
  expect(isEmpty(undefined)).toBe(true);
});

it('Checks for min length', () => {
  const short = 'Lorem.';
  const long = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, ducimus.';
  expect(minLength(10)(short)).toEqual('Must be at least 10 characters');
  expect(minLength(10)(long)).toBe(false);
});

it('Checks for max length', () => {
  const short = 'Lorem.';
  const long = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, ducimus.';
  expect(maxLength(10)(long)).toEqual('Must be no more than 10 characters');
  expect(maxLength(10)(short)).toBe(false);
});

it('Checks for empty object', () => {
  expect(objectIsEmpty({})).toBe(true);
  expect(objectIsEmpty({ not: 'empty' })).toBe(false);
});

it('Returns the correct postcard dimensions', () => {
  expect([postcardDimensions('6x4'), postcardDimensions('4x6')]).toEqual(['6x4', '6x4']);
  expect([postcardDimensions('9x6'), postcardDimensions('6x9')]).toEqual(['9x6', '9x6']);
  expect([postcardDimensions('11x6'), postcardDimensions('6x11')]).toEqual(['11x6', '11x6']);
  expect([postcardDimensions('badValue'), postcardDimensions('')]).toEqual(['', '']);
});

it('Returns the correct postcard display dimensions', () => {
  expect([postcardDimensionsDisplayed('6x4'), postcardDimensionsDisplayed('4x6')]).toEqual([
    '4x6',
    '4x6',
  ]);
  expect([postcardDimensionsDisplayed('9x6'), postcardDimensionsDisplayed('6x9')]).toEqual([
    '6x9',
    '6x9',
  ]);
  expect([postcardDimensionsDisplayed('11x6'), postcardDimensionsDisplayed('6x11')]).toEqual([
    '6x11',
    '6x11',
  ]);
  expect([postcardDimensionsDisplayed('badValue'), postcardDimensionsDisplayed('')]).toEqual([
    '',
    '',
  ]);
});

it('Returns the correct iframe dimensions', () => {
  expect([iframeDimensions('').width, iframeDimensions('').height]).toEqual([600, 408]);
  expect([iframeDimensions('4x6').width, iframeDimensions('4x6').height]).toEqual([600, 408]);
  expect([iframeDimensions('9x6').width, iframeDimensions('9x6').height]).toEqual([888, 600]);
  expect([iframeDimensions('6x9').width, iframeDimensions('6x9').height]).toEqual([888, 600]);
  expect([iframeDimensions('11x6').width, iframeDimensions('11x6').height]).toEqual([1080, 600]);
  expect([iframeDimensions('6x11').width, iframeDimensions('6x11').height]).toEqual([1080, 600]);
});

it('Strips the KWKLY code correctly', () => {
  const test1 = 'MYCODE';
  const test2 = '';
  const test3 = `Text ${test1} to 59559 for details!`;
  const test4 = `Text Text Text ${test1} to 59559 for details! to 59559 for details! to 59559 for details!`;

  expect(strippedKWKLY(test1)).toEqual('MYCODE');
  expect(strippedKWKLY(test2)).toEqual('');
  expect(strippedKWKLY(test3)).toEqual('MYCODE');
  expect(strippedKWKLY(test4)).toEqual('MYCODE');
});
