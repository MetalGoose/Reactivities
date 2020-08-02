using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest 
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }

            // Значение даты в базе не может быть null,
            // но оно может прийти таковым если пользователь не будет обновлять время активности.
            // Так что мы делаем его nullable для избежания ошибок в обработчике (Handle()) при обновлении свойств
            public DateTime? Date { get; set; } 
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();
            }
        }
        
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _contex;
        
            public Handler(DataContext contex)
            {
                _contex = contex;
            }
        
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _contex.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new ApplicationException("Could not find activity");

                //Обновляем значения всех свойств активности если требуется
                //Рефлексия тут используется просто по фану и для изучения ее работы.
                //Не стоит забывать что согласно "The Performance of Everyday Things, Jeff Richter" - рефлексия в 1000 раз медленнее чем обычное взаимодействие
                var activityProps = typeof(Activity).GetProperties();
                var commandProps = typeof(Command).GetProperties();

                for (int i = 0; i < activityProps.Length; i++)
                {
                    System.Console.WriteLine(commandProps[i].GetValue(request));
                    System.Console.WriteLine(activityProps[i].GetValue(activity));
                    activityProps[i].SetValue(activity, commandProps[i].GetValue(request) ?? activityProps[i].GetValue(activity));
                }

                var success = await _contex.SaveChangesAsync() > 0;
        
                if (success) return Unit.Value;
        
                throw new ApplicationException("Problem saving changes");
            }
        }
    }
}