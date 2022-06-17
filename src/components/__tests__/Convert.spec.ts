import { describe, it, expect } from 'vitest'

import { mount, shallowMount } from '@vue/test-utils'
import Convert from '../Convert.vue'

describe('Convert', () => {
	it('renders properly', async () => {
		const wrapper = mount(Convert)
		// await wrapper.find('#convertBtn').trigger('click')
		// expect(wrapper.find('.box-alert')).toContain('Error : Please write an integer between 0 to 100 in the input')
		expect(wrapper.find('h3')).toContain('Convert')
	})
})
