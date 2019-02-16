/* eslint-disable no-unused-expressions */
const { expect, assert } = require('chai');

const utils = require('../lib/utils');

describe('feathers-swagger utils', () => {
  describe('basic functionality', () => {
    it('gets correct type for a type', () => {
      const mapping = {
        _NOT_EXIST: '',
        ARRAY: 'array',
        BIGINT: 'integer',
        BLOB: 'string',
        BOOLEAN: 'boolean',
        CHAR: 'string',
        DATE: 'string',
        DATEONLY: 'string',
        DECIMAL: 'number',
        DOUBLE: 'number',
        FLOAT:'number',
        INTEGER: 'integer',
        NOW: 'string',
        STRING: 'string',
        TEXT: 'string',
        TIME: 'string',
      };

      for (const type in mapping) {
        expect(utils.getType(type)).to.equal(mapping[type]);
      }
    });

    it('gets correct format for a type', () => {
      const mapping = {
        _NOT_EXIST: '',
        BIGINT: 'int64',
        DATE: 'date',
        DATEONLY: 'date',
        DECIMAL: 'int32',
        DOUBLE: 'double',
        FLOAT: 'float',
        INTEGER: 'int32',
        NOW: 'date-time',
        TIME: 'date-time',
      };

      for (const type in mapping) {
        expect(utils.getFormat(type)).to.equal(mapping[type]);
      }
    });

    describe('service tag generation', () => {
      it('generates default service tags', () => {
        const tag = utils.tag('test');

        expect(tag.name).to.equal('test');
        expect(tag.description).to.equal('A test service');
        assert.isEmpty(tag.externalDocs);
      });

      it('does not override passed options', () => {
        const options = {
          description: 'A custom description',
          externalDocs: {
            hello: 'world'
          }
        };
        const tag = utils.tag('test', options);

        expect(tag.name).to.equal('test');
        expect(tag.description).to.equal(options.description);
        expect(tag.externalDocs).to.equal(options.externalDocs);
      });
    });

    it('generates property objects', () => {
      const fixtures = [
        {
          type: 'FLOAT',
          items: '',
          expected: {
            type: 'number',
            format: 'float'
          }
        }, {
          type: 'STRING',
          items: '',
          expected: {
            type: 'string',
            format: ''
          }
        }, {
          type: 'ARRAY',
          items: undefined,
          expected: {
            type: 'array',
            format: '',
            items: {
              type: 'integer'
            }
          }
        }, {
          type: 'ARRAY',
          items: 'ball',
          expected: {
            type: 'array',
            format: '',
            items: {
              $ref: '#/definitions/ball'
            }
          }
        }, {
          type: 'ARRAY',
          items: {
            key: 'STRING'
          },
          expected: {
            type: 'array',
            format: '',
            items: {
              type: 'string'
            }
          }
        }
      ];

      for (const fixture of fixtures) {
        const property = utils.property(fixture.type, fixture.items);
        expect(property).to.deep.equal(fixture.expected);
      }
    });
  });
});
