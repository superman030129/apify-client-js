import _ from 'underscore';
import { expect } from 'chai';
import ApifierClient, { getDefaultOptions } from '../src';

const APIFIER_INSTANCE_KEYS = ['acts', 'crawlers', 'keyValueStores', 'setOptions'];

describe('ApifierClient', () => {
    // TODO: add test for preconfigured utils.requestPromise().

    it('should be possible to initiate it both with and without "new"', () => {
        const apifierClientWith = new ApifierClient();
        const apifierClientWithout = ApifierClient();

        expect(_.keys(apifierClientWith)).to.be.eql(APIFIER_INSTANCE_KEYS);
        expect(_.keys(apifierClientWithout)).to.be.eql(APIFIER_INSTANCE_KEYS);
    });

    it('should correctly set all options', () => {
        const defaultOpts = getDefaultOptions();
        const instanceOpts = { storeId: 'abc123', host: 'host-overriden', basePath: 'base-path-123' };
        const callOpts = { port: 999, basePath: 'base-path-overriden', recordKey: 'some-key' };

        const expected = Object.assign({}, defaultOpts, instanceOpts, callOpts);

        // eslint-disable-next-line prefer-template
        expected.baseUrl = expected.protocol
                         + '://'
                         + expected.host
                         + (expected.port ? `:${expected.port}` : '')
                         + expected.basePath;
        expected.promise = Promise;

        const methods = {
            group1: {
                method1: params => Promise.resolve(params),
            },
        };

        const apifierClient = new ApifierClient(instanceOpts, methods);


        return apifierClient
            .group1
            .method1(callOpts)
            .then(options => expect(options).to.be.eql(expected));
    });

    it('should be possible to change options using apifierClient.setOptions(opts)', () => {
        const methods = {
            group1: {
                method1: params => Promise.resolve(params.baseUrl),
            },
        };

        const apifierClient1 = new ApifierClient({
            protocol: 'http',
            host: 'myhost-1',
            basePath: '/mypath-1',
            port: 80,
        }, methods);

        const apifierClient2 = new ApifierClient({
            protocol: 'http',
            host: 'myhost-2',
            basePath: '/mypath-2',
            port: 80,
        }, methods);

        return Promise
            .all([
                apifierClient1.group1.method1(),
                apifierClient2.group1.method1(),
            ])
            .then(([baseUrl1, baseUrl2]) => {
                expect(baseUrl1).to.be.eql('http://myhost-1:80/mypath-1');
                expect(baseUrl2).to.be.eql('http://myhost-2:80/mypath-2');

                apifierClient1.setOptions({ host: 'my-very-new-host' });

                return Promise
                    .all([
                        apifierClient1.group1.method1(),
                        apifierClient2.group1.method1(),
                    ])
                    .then(([anotherBaseUrl1, anotherBaseUrl2]) => {
                        expect(anotherBaseUrl1).to.be.eql('http://my-very-new-host:80/mypath-1');
                        expect(anotherBaseUrl2).to.be.eql('http://myhost-2:80/mypath-2');
                    });
            });
    });

    it('should be possible to use with promises', () => {
        const methods = {
            group1: {
                method1: () => Promise.resolve('someResponse'),
            },
        };

        const apifierClient = new ApifierClient({ protocol: 'http', host: 'myhost' }, methods);

        return apifierClient
            .group1
            .method1()
            .then(response => expect(response).to.be.eql('someResponse'));
    });

    it('should be possible handle errors when used with promises', () => {
        const methods = {
            group1: {
                method1: () => Promise.reject(new Error('my-error')),
            },
        };

        const apifierClient = new ApifierClient({ protocol: 'http', host: 'myhost' }, methods);

        return apifierClient
            .group1
            .method1()
            .then(
                () => { throw new Error('error-not-handled'); },
                err => expect(err.message).to.be.eql('my-error'),
            );
    });

    it('should be possible to use with callbacks', () => {
        const methods = {
            group1: {
                method1: () => Promise.resolve('someResponse'),
            },
        };

        const apifierClient = new ApifierClient({ protocol: 'http', host: 'myhost' }, methods);

        return apifierClient
            .group1
            .method1({}, (error, response) => {
                expect(error).to.be.eql(null);
                expect(response).to.be.eql('someResponse');
            });
    });

    it('should be possible handle errors when used with callbacks', () => {
        const methods = {
            group1: {
                method1: () => Promise.reject(new Error('my-error')),
            },
        };

        const apifierClient = new ApifierClient({ protocol: 'http', host: 'myhost' }, methods);

        return apifierClient
            .group1
            .method1({}, (error, response) => {
                expect(error.message).to.be.eql('my-error');
                expect(response).to.be.eql(undefined);
            });
    });
});