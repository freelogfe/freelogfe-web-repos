export default {
    name: 'freelog-tags',
    data() {
        return {
            tags: [],
            inputVisible: false,
            inputValue: ''
        }
    },
    props: {
        value: {
            type: Array,
            default() {
                return []
            }
        },
        actionText: {
            type: String,
            default() {
                return 'New Tag'
            }
        },
        isCanCURD: {
            type: Boolean,
            default: true
        },
    },
    watch: {
        value(val) {
            this.setCurrentValue(val)
        }
    },
    mounted() {
        this.setCurrentValue(this.value)
    },
    methods: {
        setCurrentValue(value) {
            this.tags = value
        },
        handleClose(tag) {
            // this.tags.splice(this.tags.indexOf(tag), 1)

            this.tags = this.tags.filter(i => i !== tag);
            this.$emit('input', this.tags);
        },
        showInput() {
            this.inputVisible = true
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        handleInputConfirm() {
            const inputValue = this.inputValue
        
            if (inputValue) {
                // this.tags.push(inputValue)
                const tags = [
                    ...this.tags,
                    inputValue,
                ];
                this.tags = Array.from(new Set(tags));
                this.$emit('input', this.tags)
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
}
