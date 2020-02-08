// Cement's heart
export default class Cement {
    public data: object;
    public methods: object;
    public element: string;

    // Create Cemenet instance
    constructor(public config: any) {
        this.data = <object> config['data'];
        this.methods = <object> config['methods'];
        this.element = <string> config['el'];

        this.makeReactive();
        this.renderData();
    }

    renderData(): void {
        let root = document.querySelector(this.element);
        let children = [...root.childNodes];

        children.forEach((e: any) => {
            // if child is an element
            if(e.nodeType === 1) {
                
                let dataWrapper = e.innerHTML.match('{{(.*)}}')[0]; 
                let dataName = e.innerHTML.match('{{(.*)}}')[1].trim();
                let value = this.data[dataName]; 

                if(dataName.includes('.')) {

                    // getDescendantProp from https://gist.github.com/jasonrhodes/2321581#gistcomment-1813156
                    const getDescendantProp = (obj, path) => (
                        path.split('.').reduce((acc, part) => acc && acc[part], obj)
                    );

                    e.innerHTML = e.innerHTML.replace(dataWrapper, getDescendantProp(this.data, dataName));
                } else {
                    e.innerHTML = e.innerHTML.replace(dataWrapper, value);
                }

            }
        });
        
    }

    makeReactive() {

        for(let property in this.data) {
            let value = this.data[property];

            Object.defineProperty(this.data, property, {
                get: function cementGetter() {
                    return value;
                },
                set: function cementSetter(newValue) {
                    return value = newValue;
                }
            })
        
        }
    }
}