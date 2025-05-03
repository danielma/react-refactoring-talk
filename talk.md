---
author: DMa
title: "Refactoring"
sub_title: "live. kinda"
date: 2025-05-05
theme:
  name: light
---

Hi, I'm DMa
===

- 🟢 October 2015 (almost 10 years!)
- 🏠 Engineering Manager of Home
- Giving, Groups, Login, Home

<!-- end_slide -->

Why are we here?
===

- 👀 First time learning
- 🏀 Drills

<!-- end_slide -->


Refactoring
===

# What

~~~
Refactoring (noun): a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior.
~~~

~~~
Refactoring (verb): to restructure software by applying a series of refactorings without changing its observable behavior.
~~~

---

_https://martinfowler.com/bliki/DefinitionOfRefactoring.html_

<!-- end_slide -->

Refactoring
===

# What

Like so much of programming, has its roots in math

Your very first refactor probably looked like this:

```
5(7𝑦+2) = 35𝑦+10
```

<!-- end_slide -->

Refactoring
===

# Why

~~~
First make the change easy, then make the easy change

- Kent Beck
~~~

<!-- end_slide -->

Refactoring
===

# Why (ideologically)

- Codebases are gardens (care & feeding)

<!-- end_slide -->

Refactoring
===

# Why (ideologically)

- Codebases are gardens (care & feeding)

# Why (payoffs)

- Easier to **understand**
- Easier to **change**
- Easier to **fix**

<!-- end_slide -->

The Simplest Refactoring
===

<!-- alignment: center -->

# Uncommunicative Name →  Rename Variable

```ruby
a = height * width
```

↓

```ruby
area = height * width
```

<!-- end_slide -->

When does it count?
===

<!-- alignment: center -->

🎉 _It depends_ 🎉

---

What does "visible change" mean in your context?

---

- Visual regression testing?
- All tests pass?
- QA can't tell the difference?

<!-- end_slide -->

Resources
===

- https://refactoring.com/catalog/
- https://refactoring.guru/refactoring/smells
- https://luzkan.github.io/smells/

<!-- end_slide -->

Tennis Exercises
===

```
$ cd tennis
$ open tennis.rb
$ ./watch
```

3 minute timer to write down code smells. No changes!

<!-- end_slide -->

Tennis Exercies
===

- Rank the smells you care about most
- Spend 5 minutes trying to fix them, one at a time, with one line changes

<!-- end_slide -->

Now we check where we're at with time
