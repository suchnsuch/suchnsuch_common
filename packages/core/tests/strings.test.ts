import { findFullCharacterForward, findFullCharacterReverse } from '../src/strings'

describe('findFullCharacter', () => {
	it('Should return a single character for ASCII-like characters', () => {
		expect(findFullCharacterForward('test')).toEqual('t')
		expect(findFullCharacterForward('test', 1)).toEqual('e')

		expect(findFullCharacterReverse('test', 3)).toEqual('s')
	})

	it('Should return all of a surrogate pair', () => {
		expect('😉'.length).toEqual(2)
		expect(findFullCharacterForward('Hi😉there', 2)).toEqual('😉')

		expect(findFullCharacterReverse('Hi😉there', 4)).toEqual('😉')
	})

	it('Should not continue to consume after a normal character', () => {
		expect(findFullCharacterForward('Hi 😉 there', 2)).toEqual(' ')
	})

	it('Should return all of a combined emoji', () => {
		expect(findFullCharacterForward('👨‍👩‍👧‍👦')).toEqual('👨‍👩‍👧‍👦')
	})

	it('Should be able to return the first character, backwards', () => {
		expect(findFullCharacterReverse('hello', 1)).toEqual('h')
		expect(findFullCharacterReverse('😉hello', 2)).toEqual('😉')
	})

	it('Should not consume sequential dashes', () => {
		expect(findFullCharacterForward('---')).toEqual('-')
	})
})
