/* Supabase Browser Bundle Wrapper */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.supabase = {}));
}(this, (function (exports) { 'use strict';
    // Beágyazott mini-kliens a lokális teszteléshez és áthidaláshoz
    exports.createClient = function (url, key) {
        return {
            auth: {
                signUp: async function (authData) {
                    const res = await fetch(`${url}/auth/v1/signup`, {
                        method: 'POST',
                        headers: { 'apikey': key, 'Content-Type': 'application/json' },
                        body: JSON.stringify(authData)
                    });
                    return res.json();
                },
                signInWithPassword: async function (authData) {
                    const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
                        method: 'POST',
                        headers: { 'apikey': key, 'Content-Type': 'application/json' },
                        body: JSON.stringify(authData)
                    });
                    const data = await res.json();
                    if (data.error) return { data: null, error: data };
                    return { data: { user: data.user }, error: null };
                },
                signOut: async function () { return { error: null }; }
            },
            from: function (tableName) {
                return {
                    select: function (columns) {
                        return {
                            eq: function (col, val) {
                                return {
                                    single: async function () {
                                        const res = await fetch(`${url}/rest/v1/${tableName}?${col}=eq.${val}`, {
                                            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
                                        });
                                        const arr = await res.json();
                                        return { data: arr[0] || null, error: null };
                                    }
                                };
                            },
                            order: function () {
                                return {
                                    then: async function (cb) {
                                        const res = await fetch(`${url}/rest/v1/${tableName}`, {
                                            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
                                        });
                                        const data = await res.json();
                                        cb({ data, error: null });
                                    }
                                };
                            }
                        };
                    }
                };
            }
        };
    };
})));
