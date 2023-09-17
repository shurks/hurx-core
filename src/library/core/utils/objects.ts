/**
 * The objects utility class
 */
export default class Objects {
    /**
     * Deeply assigns objectB by objectA
     * @param objectA the object to assign to
     * @param objectB the object to assign with
     */
    public static deepAssign(objectA: {}, objectB: {}) {
        for (const key of Object.keys(objectB)) {
            if (Array.isArray((objectA as any)[key])) {
                if (Array.isArray((objectB as any)[key])) {
                    (objectA as any)[key] = [
                        ...(objectA as any)[key],
                        ...(objectB as any)[key]
                    ]
                }
                else if (!!(objectB as any)[key]) {
                    (objectA as any)[key] = (objectB as any)[key]
                }
            }
            if (typeof (objectA as any)[key] === 'object') {
                if (typeof (objectB as any)[key] === 'object') {
                    (objectA as any)[key] = this.deepAssign((objectA as any)[key], (objectB as any)[key])
                }
                else if (!!(objectB as any)[key]) {
                    (objectA as any)[key] = (objectB as any)[key]
                }
            }
            else {
                (objectA as any)[key] = (objectB as any)[key]
            }
        }
        return objectA
    }
}