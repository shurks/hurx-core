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
            if (typeof (objectA as any)[key] === 'object') {
                if (typeof (objectB as any)[key] === 'object') {
                    (objectA as any)[key] = this.deepAssign((objectA as any)[key], (objectB as any)[key])
                }
                else {
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